export const uploadImageToImageBB = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IMAGEBB_API_URL}?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
