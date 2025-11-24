import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface BeforeAfterSliderProps {
  imageLeft: string;
  imageRight: string;
  labelLeft?: string;
  labelRight?: string;
}

export default function BeforeAfterSlider({
  imageLeft,
  imageRight,
  labelLeft = "Tissu 1",
  labelRight = "Tissu 2",
}: BeforeAfterSliderProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={imageLeft}
            alt={labelLeft}
            className="object-contain w-full h-full"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={imageRight}
            alt={labelRight}
            className="object-contain w-full h-full"
          />
        }
        position={50}
        className="h-[500px] md:h-[600px]"
      />
      <div className="flex justify-between bg-gray-100 px-4 py-2 text-sm font-medium">
        <span className="text-gray-700">{labelLeft}</span>
        <span className="text-gray-700">{labelRight}</span>
      </div>
    </div>
  );
}
