import postApiBase from './postApiBase';

export default async function () {
  const data = await postApiBase('uiconfig');

  return data;
}
