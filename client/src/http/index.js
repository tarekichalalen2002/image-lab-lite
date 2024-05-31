const getGrayScale = async (image, setRequestPending) => {
    setRequestPending(true)
    const formData = new FormData();
    formData.append('image', image);
    try {
        const response = await fetch('http://127.0.0.1:5000/to-gray', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setRequestPending(false)
          return url
        } else {
          console.error('File upload failed:', response.statusText);
          setRequestPending(false)
          return null
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setRequestPending(false)
        return null
      }
}

const getBluredFaces = async (image, setRequestPending) => {
  setRequestPending(true)
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await fetch('http://127.0.0.1:5000/blur-face', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRequestPending(false)
        return url
      } else {
        console.error('File upload failed:', response.statusText);
        setRequestPending(false)
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setRequestPending(false)
      return null
    }
}

const getBGremoved = async (image, setRequestPending) => {
  setRequestPending(true)
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await fetch('http://127.0.0.1:5000/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRequestPending(false)
        return url
      } else {
        console.error('File upload failed:', response.statusText);
        setRequestPending(false)
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setRequestPending(false)
      return null
    }
}

const getBlackeWhite = async (image, setRequestPending) => {
  setRequestPending(true)
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await fetch('http://127.0.0.1:5000/to-black-white', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRequestPending(false)
        return url
      } else {
        console.error('File upload failed:', response.statusText);
        setRequestPending(false)
        return null
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setRequestPending(false)
      return null
    }
}

const getDeletedChannels = async (image, setRequestPending, channelsToDelete) => {
  setRequestPending(true)
  const formData = new FormData();
  formData.append("image", image)
  formData.append('channels', JSON.stringify(channelsToDelete));
  try {
    const response = await fetch('http://127.0.0.1:5000/delete-channels', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setRequestPending(false)
      return url
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    setRequestPending(false)
    return null
  }

}

export {
  getGrayScale,
  getBluredFaces,
  getBGremoved,
  getBlackeWhite,
  getDeletedChannels
}