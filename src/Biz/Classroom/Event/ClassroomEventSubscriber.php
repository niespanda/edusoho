<?php

namespace Biz\Classroom\Event;

use AppBundle\Common\StringToolkit;
use Biz\Classroom\Service\ClassroomReviewService;
use Biz\Classroom\Service\ClassroomService;
use Biz\Review\Service\ReviewService;
use Biz\Taxonomy\TagOwnerManager;
use Biz\User\Service\NotificationService;
use Codeages\Biz\Framework\Event\Event;
use Codeages\PluginBundle\Event\EventSubscriber;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ClassroomEventSubscriber extends EventSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            'classroom.delete' => 'onClassroomDelete',
            'classroom.course.create' => 'onClassroomCourseChange',
            'classroom.course.delete' => 'onClassroomCourseChange',
            'classroom.course.update' => 'onClassroomCourseChange',
            'classReview.add' => 'onReviewCreate',

            'review.create' => 'onReviewChanged',
            'review.update' => 'onReviewChanged',
            'review.delete' => 'onReviewChanged',
        ];
    }

    public function onClassroomDelete(Event $event)
    {
        $classroom = $event->getSubject();
        $tagOwnerManager = new TagOwnerManager('classroom', $classroom['id']);
        $tagOwnerManager->delete();
    }

    public function onClassroomCourseChange(Event $event)
    {
        $classroom = $event->getSubject();
        $classroomId = $classroom['id'];
        $courseNum = $this->getClassroomService()->countCoursesByClassroomId($classroomId);
        $taskNum = $this->getClassroomService()->countCourseTasksByClassroomId($classroomId);

        $fields = ['courseNum' => $courseNum, 'lessonNum' => $taskNum];
        $this->getClassroomService()->updateClassroom($classroomId, $fields);
        $this->getClassroomService()->updateClassroomTeachers($classroomId);
    }

    public function onReviewCreate(Event $event)
    {
        $review = $event->getSubject();

        if ($review['parentId'] > 0) {
            $classroom = $this->getClassroomService()->getClassroom($review['classroomId']);

            $parentReview = $this->getClassroomReviewService()->getReview($review['parentId']);
            if (!$parentReview) {
                return false;
            }

            $message = [
                'title' => $classroom['title'],
                'targetId' => $review['classroomId'],
                'targetType' => 'classroom',
                'userId' => $review['userId'],
            ];
            $this->getNotifiactionService()->notify($parentReview['userId'], 'comment-post',
                $message);
        }
    }

    public function onReviewChanged(Event $event)
    {
        $review = $event->getSubject();

        if ('classroom' != $review['targetType']) {
            return true;
        }

        $ratingFields = $this->getReviewService()->countRatingByTargetTypeAndTargetId($review['targetType'], $review['targetId']);
        $this->getClassroomService()->updateClassroom($review['targetId'], $ratingFields);
    }

    private function simplifyClassroom($classroom)
    {
        return [
            'id' => $classroom['id'],
            'title' => $classroom['title'],
            'picture' => $classroom['middlePicture'],
            'about' => StringToolkit::plain($classroom['about'], 100),
            'price' => $classroom['price'],
        ];
    }

    /**
     * @return NotificationService
     */
    protected function getNotifiactionService()
    {
        return $this->getBiz()->service('User:NotificationService');
    }

    /**
     * @return ClassroomService
     */
    private function getClassroomService()
    {
        return $this->getBiz()->service('Classroom:ClassroomService');
    }

    /**
     * @return ClassroomReviewService
     */
    private function getClassroomReviewService()
    {
        return $this->getBiz()->service('Classroom:ClassroomReviewService');
    }

    /**
     * @return ReviewService
     */
    protected function getReviewService()
    {
        return $this->getBiz()->service('Review:ReviewService');
    }
}
