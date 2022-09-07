import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserImage } from "../../../redux/actions/Actions";
import { Upload, UploadOutlined, Button } from '../../atoms';
import { message } from '@pm/pm-ui';
import _ from "lodash";
import { Modal } from 'antd';
import { useOktaAuth } from '@okta/okta-react';

const ImageUploadSection = () => {
  const [ imageFileObject, setImageFileObject ] = useState({});
  const { oktaAuth, authState } = useOktaAuth();
  const dispatch = useDispatch();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  //uploading image cloudinary + mongodb
  async function uploadIamge(fileObj) {
    try {
      if (oktaUserId && fileObj){
        dispatch(updateUserImage(oktaUserId, fileObj));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(!_.isEmpty(imageFileObject)){
      uploadIamge(imageFileObject);
    }
  }, [imageFileObject])

  const responseData = useSelector(state => state.updateUserImageReducer.data || {});
  console.log(responseData);

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // uploadIamge(info.file.originFileObj);
        setImageFileObject(info.file.originFileObj);
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};

export default ImageUploadSection;
