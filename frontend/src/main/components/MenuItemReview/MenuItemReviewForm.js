import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line Regex
    const numeric_regex = /^\d+$/;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="MenuItemReviewForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="itemId">Menu Item Id</Form.Label>
                        <Form.Control
                            data-testid="MenuItemReviewForm-itemId"
                            id="itemId"
                            type="text"
                            isInvalid={Boolean(errors.itemId)}
                            {...register("itemId", { 
                                required: "Item Id is required.",
                                pattern: numeric_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.itemId?.message}
                            {errors.itemId?.type === 'pattern' && 'Item Id must be valid.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="reviewerEmail">Email</Form.Label>
                        <Form.Control
                            data-testid="MenuItemReviewForm-reviewerEmail"
                            id="reviewerEmail"
                            type="text"
                            isInvalid={Boolean(errors.reviewerEmail)}
                            {...register("reviewerEmail", {
                                required: "Reviewer Email is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="stars">Stars</Form.Label>
                        <Form.Control
                            data-testid="MenuItemReviewForm-stars"
                            id="stars"
                            type="text"
                            isInvalid={Boolean(errors.stars)}
                            {...register("stars", { 
                                required: "Stars is required.", 
                                min: {value: 1, message: "Min star rating is 1"},
                                max: {value: 5, message: "Max star rating is 5"},
                                pattern: numeric_regex
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stars?.message}
                            {errors.stars?.type === 'pattern' && 'Stars must be a number from 1 to 5.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="localDateTime">Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid="MenuItemReviewForm-localDateTime"
                            id="localDateTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.localDateTime)}
                            {...register("localDateTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.localDateTime && 'LocalDateTime is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                        <Form.Control
                            data-testid="MenuItemReviewForm-comments"
                            id="comments"
                            type="text"
                            isInvalid={Boolean(errors.comments)}
                            {...register("comments", {
                                required: "Comments is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.comments?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type="submit" data-testid="MenuItemReviewForm-submit">
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        data-testid="MenuItemReviewForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default MenuItemReviewForm;
