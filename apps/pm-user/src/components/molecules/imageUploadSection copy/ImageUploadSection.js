import { useState, useEffect } from 'react';
import { Button, Upload, UploadOutlined } from '../../atoms';
import { message } from '@pm/pm-ui';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';

const ImageUploadSection = () => {
  //vinit
  const { oktaAuth, authState } = useOktaAuth();
  const [uploadImage, setUploadImage] = useState();
  const [imageFromCloud, setImageFromCloud] = useState();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    setUploading(true); // You can use any AJAX library you like

    // 019d300000 << response.
    // https://www.cloudinarycdn.io/v2/image/${019d300000}
    // use cloudinary's end point below instead of mocky.io
    fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  //start vinit

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;
  async function uploadIamge() {

    try{
      const formData = new FormData();
    // console.log(uploadImage);
    formData.append('file', uploadImage);
    formData.append('upload_preset', 'lb3xedsh');

    const response = await axios.post('https://api.cloudinary.com/v1_1/pesto-matrimony/image/upload', formData);
    const imageUrlString = response.data.url;
    setImageFromCloud(response.data.url);

    console.log(imageUrlString);
    const payload = {
      oktaUserId,
      imageUrlString,
    };
    //sending image-url and current-user-id on endpoint
    if (oktaUserId && imageUrlString) {
      const res = await axios.post(`http://localhost:8000/api/v1/users/imageupload/${oktaUserId}`, payload);
      console.log(res);
    }
    }catch(err){
      console.log(err);
    }

    
  }
  //end vinit

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  return (
    <>
      <div>
        <input type="file" onChange={(e) => setUploadImage(e.target.files[0])} />
        <button onClick={uploadIamge}>Submit Image</button>
      </div>

      <img src={imageFromCloud} />
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  );
};

export default ImageUploadSection;
