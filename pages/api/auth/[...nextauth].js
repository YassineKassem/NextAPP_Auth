import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '../../../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';  // Import UUID generator

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const googleId = user.id || user.sub;

      // Check if user already exists in the Supabase profiles table
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('google_id', googleId)  // Use Google ID as the identifier
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {  // 'PGRST116' means the user doesn't exist, which is expected
        console.error('Error fetching user from Supabase:', fetchError);
        return false;
      }

      if (!existingUser) {
        // User doesn't exist, so insert them into the profiles table
        const newUUID = uuidv4();  // Generate a new UUID

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: newUUID,  // Insert generated UUID
            google_id: googleId,  // Store Google ID
            email: user.email,
            name: user.name || '',
            image_url: user.image,  // Store Google profile image
          });

        if (insertError) {
          console.error('Error inserting user into Supabase:', insertError);
          return false;  // Fail sign-in if there's an error
        }
      } else {
        // User exists, update their image
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ image_url: user.image })
          .eq('google_id', googleId);

        if (updateError) {
          console.error('Error updating user image:', updateError);
          return false;
        }
      }

      return true;  // Allow sign-in
    },
    async session({ session, token }) {
      session.user.id = token.sub;  // Attach Google user ID (or UUID if preferred) to session
      return session;
    },
  },
};

export default NextAuth(authOptions);
