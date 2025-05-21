import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const TrainingSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Các chương trình đào tạo tại ROOMIEHUB
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-md">
            <div className="p-4">
              <h3 className="text-lg font-bold mb-3">
                Chinh phục các kỹ năng mới cùng ROOMIEHUB
              </h3>
              <p className="text-gray-600 mb-4">
                Truy cập 1000+ khóa học về kinh doanh, Bất động sản, hoàn thiện
                bản thân và còn nhiều hơn thế nữa
              </p>
              <Button label="Tìm hiểu thêm" className="p-button-outlined" />
            </div>
          </Card>

          <Card className="shadow-md">
            <div className="p-4">
              <h3 className="text-lg font-bold mb-3">
                Tăng khả năng tìm được việc làm
              </h3>
              <p className="text-gray-600 mb-4">
                Cung cấp các chứng chỉ có giá trị, được công nhận trong ngành,
                giúp tăng thêm độ tin cậy cho hồ sơ của bạn và gây ấn tượng với
                các nhà tuyển dụng.
              </p>
              <Button label="Tìm hiểu thêm" className="p-button-outlined" />
            </div>
          </Card>

          <Card className="shadow-md">
            <div className="p-4">
              <h3 className="text-lg font-bold mb-3">
                Học hỏi từ hơn 1000 các chuyên gia từ khắp nơi trên thế giới
              </h3>
              <p className="text-gray-600 mb-4">
                Nâng kỹ năng của bạn lên một tầm cao mới với các khóa học từ
                những người giỏi nhất
              </p>
              <Button label="Tìm hiểu thêm" className="p-button-outlined" />
            </div>
          </Card>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Cùng ROOMIEHUB học hỏi từ những người giỏi nhất
              </h2>
              <div className="bg-orange-500 text-white inline-block px-4 py-2 rounded-lg mb-4">
                ĐẦU TƯ SỰ NGHIỆP
                <br />
                VỮNG BƯỚC TƯƠNG LAI
              </div>
              <p className="text-gray-600 mb-4">
                <strong>77% người học báo cáo các lợi ích nghề nghiệp</strong>{" "}
                chẳng hạn như tìm được một công việc mới, thăng chức, đạt được
                các kỹ năng phù hợp và hơn thế nữa
              </p>
              <Button label="Xem thêm khóa học" className="p-button-outlined" />
            </div>
            <div className="md:w-1/3">
              <img
                src="https://ext.same-assets.com/662425795/2179942551.png"
                alt="Training Programs"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
