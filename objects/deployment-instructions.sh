export APP_NAME="barebones"

workon devops && \
    denv && \
    dbuild $APP_NAME:$(gcloud/get_next_image_tag.sh $APP_NAME) images/$APP_NAME/ && \
    dpush $APP_NAME:$(gcloud/get_next_image_tag.sh $APP_NAME) && \
    PRIMARY_IMAGE_VERSION=$(gcloud/get_current_image_tag.sh $APP_NAME) j2 objects/$APP_NAME/controller.json.j2 | kubectl delete -f - && \
    PRIMARY_IMAGE_VERSION=$(gcloud/get_current_image_tag.sh $APP_NAME) j2 objects/$APP_NAME/controller.json.j2 | kubectl create -f -
