
interface CoursePageProps {
    params: {courseId:string},
}

const CoursePage = (props:CoursePageProps) => {

    const {courseId} = props.params;

  return (
    <div>CoursePage</div>
  )
}

export default CoursePage