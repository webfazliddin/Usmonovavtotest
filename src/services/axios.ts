/**
 * axios setup to use mock service
 */

const { API_URL } = useAppUrl();
import { useAppUrl } from '@/composables/useAppUrl';
import axios from 'axios';

const axiosServices = axios.create();

axios.defaults.baseURL = API_URL.value;

export default axiosServices;
