"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps{
    courseId: string;
    price: number;
}

const CourseEnrollButton = (props:CourseEnrollButtonProps) => {

    const {courseId,price} = props;

  return (
    <Button>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton