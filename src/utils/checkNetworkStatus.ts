/**
 * 使用`navigator.onLine`和主动发起网络请求的方式，判断网络是否正常
 * 这个函数首先会检查`navigator.onLine`的值，如果这个值为`false`，那么函数会立即返回网络不可用。
 * 如果这个值为`true`，函数会进一步发起一个网络请求以验证网络是否真的可用。
 * @param url
 * @returns
 */
export function checkNetworkStatus(url = 'https://www.baidu.com') {
  return new Promise<boolean>((resolve) => {
    if (!navigator.onLine) {
      resolve(false);
      return;
    }
    fetch(url, {
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
      .then(() => {
        resolve(true);
      })
      .catch((error) => resolve(false));
  });
}
