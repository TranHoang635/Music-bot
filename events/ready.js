module.exports = (client) => {
    console.log('Bot Online ✅');

    // Thiết lập trạng thái hoạt động của bot
    const setActivity = () => {
      const activityName = `${client.ws.ping}ms`;
      client.user.setActivity({
        type: 'LISTENING',
        name: activityName,
      });
    };
    setActivity();
    // Thiết lập thời gian giữa các lần chạy từ (ví dụ: 6 giây)
    setInterval(setActivity, 4000);
  };