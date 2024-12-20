import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStore } from '../config/firebaseConfig'

export async function uploadImageToFirebase(file: File): Promise<string> {
    try {
        const storageRef = ref(firebaseStore, `facilities/icons/${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadUrl = await getDownloadURL(snapshot.ref)

        return downloadUrl
    } catch (error) {
        console.error("Error uploading file:", error)
        throw error
    }
}