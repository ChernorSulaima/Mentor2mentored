import { StreamChat } from "stream-chat"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
  console.error("Stream API key and secret must be set in environment variables.")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData)=>{
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error upserting Stream user:", error)
    }
}

export const generateStreamToken = (userId)=>{
    try {
        const userIdString = userId.toString()
        return streamClient.createToken(userIdString)

    } catch (error) {
        console.error("Error generating Stream token:", error)
    }
}
