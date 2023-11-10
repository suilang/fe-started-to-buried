import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    return navigator.onLine;
  });

  const [connect, setConnect] = useState<{
    downlink: number;
    effectiveType: string;
    rtt: number;
  }>(() => {
    if (navigator.connection) {
      const connect = navigator.connection;
      return {
        downlink: connect.downlink,
        effectiveType: connect.effectiveType,
        rtt: connect.rtt,
      };
    }
    return null;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!navigator.connection) {
      return () => {};
    }
    function handleConnectionChange() {
      const connect = navigator.connection;
      setConnect({
        downlink: connect.downlink,
        effectiveType: connect.effectiveType,
        rtt: connect.rtt,
      });
    }

    navigator.connection.addEventListener('change', handleConnectionChange);
    return () => {
      navigator.connection.removeEventListener(
        'change',
        handleConnectionChange
      );
    };
  }, []);
  return (
    <div
      style={{
        border: '1px solid #dee0e3',
        padding: '24px',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #dee0e3',
          paddingBottom: 12,
          marginBottom: 12,
        }}
      >
        <span>当前页面的网络状态为:</span>
        <span
          style={{
            padding: '4px',
            borderRadius: 4,
            background: isOnline ? 'green' : 'red',
            marginLeft: 8,
            color: '#fff',
          }}
        >
          {isOnline ? '网络已连接' : '网络已断开'}
        </span>
      </div>
      {connect ? (
        <>
          <div>当前网络连接状态：</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 24px',
              background: '#f1f1f1',
              borderRadius: 4,
              color: '#999999',
            }}
          >
            <span>effectiveType: {connect.effectiveType}</span>
            <span>rtt: {connect.rtt}</span>
            <span>downlink: {connect.downlink}</span>
          </div>
        </>
      ) : (
        <div>浏览器不支持navigator.connection属性</div>
      )}
    </div>
  );
};

const wrap = () => {
  return <BrowserOnly>{() => <OnlineStatus />}</BrowserOnly>;
};
export default wrap;
