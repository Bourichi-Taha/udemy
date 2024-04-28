"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps{
    courseId: string;
    price: number;
}

const CourseEnrollButton = (props:CourseEnrollButtonProps) => {

    const {courseId,price} = props;
    //TODO: integrate stripe checkout
  return (
    <Button className="w-full md:w-auto" size={"sm"}>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton