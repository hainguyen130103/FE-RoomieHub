import React from "react";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ngọc Ánh",
      role: "Developer",
      rating: 5,
      comment:
        "Tôi đã tìm được công việc mơ ước qua ROOMIEHUB. Nền tảng rất dễ sử dụng và có nhiều cơ hội việc làm tốt.",
      image: "https://ext.same-assets.com/662425795/8720322.png",
    },
    {
      id: 2,
      name: "Minh Tuấn",
      role: "Marketing Specialist",
      rating: 5,
      comment:
        "ROOMIEHUB cung cấp những khóa học chất lượng cao giúp tôi phát triển sự nghiệp. Tôi đã học được nhiều kỹ năng mới.",
      image: "https://ext.same-assets.com/662425795/3305391905.png",
    },
    {
      id: 3,
      name: "Thanh Thúy",
      role: "Real Estate Agent",
      rating: 5,
      comment:
        "Tính năng xem nhà bằng VR thực sự hữu ích. Tôi đã tiết kiệm rất nhiều thời gian khi tìm kiếm bất động sản.",
      image: "https://ext.same-assets.com/662425795/8720322.png",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Khách hàng đã nói gì về chúng tôi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-md">
              <div className="flex flex-col items-center p-4 text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <h3 className="text-lg font-bold mb-1">{testimonial.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{testimonial.role}</p>
                <Rating
                  value={testimonial.rating}
                  readOnly
                  stars={5}
                  className="mb-3"
                  cancel={false}
                />
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === 0 ? "bg-orange-500" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
