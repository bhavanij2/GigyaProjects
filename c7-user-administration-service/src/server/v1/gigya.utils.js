import axios from 'axios';
import deline from 'deline';
import querystring from 'querystring';

const updateGigyaStatus = (federationId, isActive) => axios.post(deline`https://accounts.us1.gigya.com/accounts.setAccountInfo?\
  UID=${federationId}&apiKey=${process.env.apiKey}&secret=${process.env.secret}&\
  userKey=${process.env.userKey}`, querystring.stringify({ isActive }));

export default updateGigyaStatus;
