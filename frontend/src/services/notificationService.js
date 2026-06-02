export const notificationService = {
  requestPermission: async () => {
    if (!("Notification" in window)) {
      console.warn("Ce navigateur ne supporte pas les notifications bureau.");
      return false;
    }

    if (Notification.permission === "granted") return true;

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  },

  sendAlert: (title, body, type = 'info') => {
    if (Notification.permission !== "granted") return;

    const options = {
      body: body,
      icon: type === 'critical' ? '/favicon.ico' : '/vite.svg', // Fallback icons
      badge: '/favicon.ico',
      tag: 'sentinelops-alert',
      vibrate: [200, 100, 200]
    };

    const n = new Notification(`SentinelOps: ${title}`, options);
    
    n.onclick = () => {
      window.focus();
      n.close();
    };
  }
};
