import postApiBase from './postApiBase';

export default async function (newConfig) {
  const data = await postApiBase('uiconfig', newConfig);

  return data;
}
