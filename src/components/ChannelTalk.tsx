'use client';

import { useEffect } from 'react';

export default function ChannelTalk() {
  useEffect(() => {
    (function () {
      var w = window as any;
      if (w.ChannelIO) {
        return w.console.error('ChannelIO script included twice.');
      }
      var ch: any = function () {
        ch.c(arguments);
      };
      ch.q = [];
      ch.c = function (args: any) {
        ch.q.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
        var x = document.getElementsByTagName('script')[0];
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x);
        }
      }
      if (document.readyState === 'complete') {
        l();
      } else {
        w.addEventListener('DOMContentLoaded', l);
        w.addEventListener('load', l);
      }
    })();

    const windowAny = window as any;
    windowAny.ChannelIO('boot', {
      pluginKey: 'YOUR_PLUGIN_KEY_HERE', // TODO: 대표님께서 발급받은 채널톡 플러그인 키를 여기에 넣으세요
    });

    return () => {
      windowAny.ChannelIO('shutdown');
    };
  }, []);

  return null;
}
