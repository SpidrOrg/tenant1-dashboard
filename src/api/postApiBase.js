import { invokePostApi } from '@/parent/idpUtils';

export default async function (enpoint, payload) {
  const data = await invokePostApi(enpoint, payload);
  return data;
}
