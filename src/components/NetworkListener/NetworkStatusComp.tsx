import { checkNetworkStatus } from '@site/src/utils/checkNetworkStatus';
import React, { useEffect, useState } from 'react';
function NetworkStatusComp() {
  const [networkStatus, setNetworkStatus] = useState(() => {
    return navigator.onLine;
  });

  const handleNetworkChange = async () => {
    if (!navigator.onLine) {
      setNetworkStatus(false);
      return;
    }

    const rs = await checkNetworkStatus();
    setNetworkStatus(rs);
  };

  useEffect(() => {
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    // 如果navigator.connection存在，那么也监听它的change事件
    navigator.connection?.addEventListener('change', handleNetworkChange);

    // 定时检查网络状态
    const intervalId = setInterval(checkNetworkStatus, 30000);
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      navigator.connection?.removeEventListener('change', handleNetworkChange);
      clearInterval(intervalId);
    };
  }, []);
  return <div> 网络状态：{networkStatus ? '在线' : '离线'} </div>;
}
export default NetworkStatusComp;
