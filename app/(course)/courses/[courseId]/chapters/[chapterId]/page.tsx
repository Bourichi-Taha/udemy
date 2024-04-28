

interface SingleChapterIdPageProps {
    params: { courseId: string, chapterId: string },
}

const SingleChapterIdPage = (props:SingleChapterIdPageProps) => {

    const {chapterId,courseId} = props.params;

  return (
    <div>SingleChapterIdPage</div>
  )
}

export default SingleChapterIdPage