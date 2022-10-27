import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserImage, getUserProfile } from '../../../redux/actions/Actions';
import { Upload, UploadOutlined, DeleteOutlined, Button } from '../../atoms';
import { message, showNotification } from '@pm/pm-ui';
import ImgCrop from 'antd-img-crop'; // put into atom
import { Image } from 'antd'; // put into atom
import axios from 'axios';
import { Empty, Spin } from 'antd';
import _ from 'lodash';
import { useOktaAuth } from '@okta/okta-react';
import styles from './imageUploadSection.module.scss';

const ImageUploadSection = () => {
  const [imageFileObject, setImageFileObject] = useState({});
  const [indexForDeleteImage, setIndexForDeleteImage] = useState({});
  const [responseForLoader, setResponseForLoader] = useState({});
  const { oktaAuth, authState } = useOktaAuth();
  const [disabledButton, setDisabledButton] = useState();
  const dispatch = useDispatch();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  //uploading image cloudinary + mongodb
  async function uploadImage(fileObj) {
    try {
      if (oktaUserId && fileObj) {
        dispatch(updateUserImage(oktaUserId, fileObj));
      }
    } catch (err) {
      console.log(err);
    }
  }

  //to upload image
  useEffect(() => {
    if (!_.isEmpty(imageFileObject)) {
      uploadImage(imageFileObject);
      setIndexForDeleteImage({});
    }
  }, [imageFileObject]);

  // to delete image
  useEffect(() => {
    if (indexForDeleteImage.bool) {
      deleteImage(indexForDeleteImage.index);
    }
  }, [indexForDeleteImage]);

  useEffect(() => {
    dispatch(getUserProfile(oktaUserId));
  }, [imageFileObject]);

  const responseData = useSelector((state) => state.updateUserImageReducer.data || {});
  // console.log(responseData);
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});
  // console.log(userProfileInfo);

  const localHost = 'http://localhost:8000';
  const herokuHost = 'https://pmapi-pesto.herokuapp.com';
  const renderDotComHost = 'https://pm-api-yr8y.onrender.com';
  const baseUrl = renderDotComHost;

  //funtion to delete image
  const deleteImage = async (index) => {
    if (oktaUserId) {
      const response = await axios.delete(`${baseUrl}/api/v1/users/delete-image/${oktaUserId}/${index}`);

      if (response.data.success) {
        showNotification('success', 'Image is deleted', 'Please refresh the page');
      }
    }
  };

  let imageArray = userProfileInfo?.images || [];
  let arrayLength = imageArray.length;

  const props = {
    name: 'file',
    onChange(info) {
      if (arrayLength < 8) {
        if (info.file.status !== 'uploading') {
          // uploadImage(info.file.originFileObj);
          setImageFileObject(info.file.originFileObj);
        }

        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          console.log(info);
          // message.error(`${info.file.name} file upload failed.`);
          message.success(`${info.file.name} file uploaded successfully`);
        }
      } else {
        showNotification('error', 'Images, more then 8 can not be uploaded', '');
        console.log('checkhere');
      }
    },
  };

  //this is just to stop showing error on image upload
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  if (_.isEmpty(userProfileInfo)) {
    return (
      <div>
        <Spin className={styles.pageLoaderSpin} size="large" />
      </div>
    );
  }

  return (
    <>
      <ImgCrop rotate={true} shape="rect" aspect={16 / 9}>
        <Upload {...props} className={styles.imgCropSection} customRequest={dummyRequest}>
          <Button icon={<UploadOutlined />}>Click to Upload your Image</Button>
        </Upload>
      </ImgCrop>
      <div className={styles.imgInfoWraper}>
        <p>You cannot upload more than 8 images</p>
        <p>Images with 16:9 aspect ratio are recommended.</p>
      </div>
      <ul className={styles.imgCover}>
        {arrayLength
          ? imageArray.map((image, index) => (
              <li key={index} id={index}>
                <Image src={image} />
                <diV className={styles.deleteBtn} onClick={() => setIndexForDeleteImage({ index: index, bool: true })}>
                  {<DeleteOutlined />}
                </diV>
              </li>
            ))
          : ''}
      </ul>
    </>
  );
};

export default ImageUploadSection;
