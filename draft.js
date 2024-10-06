useEffect(() => {
  fetchFavoriteItems(); // Gọi hàm để tải sản phẩm yêu thích khi component được render
  const intervalId = setInterval(() => {
    fetchFavoriteItems(); // Gọi lại hàm này mỗi giây để kiểm tra thay đổi
  }, 1000); // Tùy chỉnh thời gian theo nhu cầu

  return () => clearInterval(intervalId); // Dọn dẹp khoảng thời gian khi component bị hủy
}, []);
