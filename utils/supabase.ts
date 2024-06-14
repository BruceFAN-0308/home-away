import {createClient} from "@supabase/supabase-js";

const bucket = 'temp-home-away'

const url = process.env.SUPABASE_URL as string
const key = process.env.SUPABASE_KEY as string

const supabase = createClient(url, key)

export async function uploadImage(image: File) {
    const time = Date.now()
    const name = `${time}-${image.name}`
    const {data, error} = await supabase.storage.from(bucket)
        .upload(name, image);
    if (!data) {
        throw new Error(`Image upload failed: ${error.message}`)
    }
    return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}
