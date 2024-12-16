import NextAuth from "next-auth"
import { authOptions } from "../../lib/authOptionsConfig"
const handler = NextAuth(authOptions)
  //next auth detecta que se inicializa uno de etos handlers ya que cuando llega una request web next auth genera una instancia Web Request y de ahi el route handler
  export { handler as GET, handler as POST } 