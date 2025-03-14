"use client";

import { Carousel, Avatar, Typography, Card, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn Gigachad",
      avatar: "avt.jpg",
      rating: 5,
      text: "Tôi rất hài lòng với chất lượng sản phẩm của Jupiter Store. Áo phông tôi mua có chất vải rất tốt và form dáng đẹp, đúng như mô tả. Giao hàng nhanh và đóng gói cẩn thận.",
    },
    {
      id: 2,
      name: "Trần Thị Mewing",
      avatar: "avt.jpg",
      rating: 4,
      text: "Dịch vụ chăm sóc khách hàng rất tốt. Tôi đã đổi size áo dễ dàng và nhân viên hỗ trợ rất nhiệt tình. Sẽ tiếp tục ủng hộ shop trong tương lai.",
    },
    {
      id: 3,
      name: "Lê Văn Mog",
      avatar: "avt.jpg",
      rating: 5,
      text: "Đây là lần thứ 3 tôi mua hàng tại Jupiter Store và chưa bao giờ thất vọng. Quần jean có form chuẩn và rất thoải mái khi mặc. Đặc biệt là chất lượng đường may rất tốt.",
    },
    {
      id: 4,
      name: "Phạm Thị Sigma",
      avatar: "avt.jpg",
      rating: 5,
      text: "Tôi yêu thích phong cách thiết kế ở đây. Mỗi món đồ đều rất thời trang và dễ phối. Giá cả hợp lý cho chất lượng nhận được.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Title level={2} className="mb-2">
            Khách hàng nói gì về chúng tôi
          </Title>
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            Sự hài lòng của khách hàng luôn là động lực để Jupiter Store không ngừng phát triển
          </Paragraph>
        </div>

        <Carousel
          autoplay
          dots={true}
          slidesToShow={3}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
          className="testimonial-carousel"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-3 py-5">
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    size={64}
                    src={testimonial.avatar}
                    icon={<UserOutlined />}
                    className="mb-3"
                  />
                  <Title level={5} className="mb-1">
                    {testimonial.name}
                  </Title>
                  <Rate disabled defaultValue={testimonial.rating} className="mb-3" />
                  <Paragraph className="text-gray-600 italic">"{testimonial.text}"</Paragraph>
                </div>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
