# import the necessary packages
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
from imutils.video import VideoStream
#from pygame import mixer
import numpy as np
import face_recognition
import imutils
import time
import cv2

import math
from datetime import datetime, timedelta
#system libraries

import sys
from threading import Timer
import shutil
import requests
import urllib3, json, wget
import base64
import os
  

detections = None

path = os.getcwd()
print ("The current working directory is %s" % path)

def FetchFiles():
	url = "http://localhost:4000/api/pendingReports/one"
	http = urllib3.PoolManager()
	getSrc = http.request('GET', 'http://localhost:4000/api/pendingReports/one')
	source = json.loads(getSrc.data)
	userId = source['user_id']

	getUser = http.request('GET', 'http://localhost:4000/api/users/' + userId)
	user = json.loads(getUser.data)
	imageSrc = user['pictures'][0]['src']
	#imageName = user['pictures'][0]['title']
	userName = user['name']
	data = imageSrc.split(',')[1]


	imgdata = base64.b64decode(data)
	filename = path + '/FaceTracker/downloads/images/'+ userName + '.jpg' # I assume you have a way of picking unique filenames
	with open(filename, 'wb') as f:
		f.write(imgdata)


	media_id = source['media_id']
		
	getMediaSrc = http.request('GET', 'http://localhost:4000/api/medias/' + media_id)

	mediaSrc = json.loads(getMediaSrc.data)

	global mediaName 
	mediaName = mediaSrc['name']
	media_path = mediaSrc['path']

	media_url = "http://localhost:4000/api/" + media_path
	wget.download(media_url, path + '/FaceTracker/downloads/videos/' + mediaName )


FetchFiles()





def detect_and_predict_mask(frame, faceNet, maskNet, threshold):
	# grab the dimensions of the frame and then construct a blob
	# from it
	global detections

	(h, w) = frame.shape[:2]
	blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104.0, 177.0, 123.0))

	# pass the blob through the network and obtain the face detections
	faceNet.setInput(blob)
	detections = faceNet.forward()

	# initialize our list of faces, their corresponding locations,
	# and the list of predictions from our face mask network
	faces = []
	locs = []
	preds = []
	# loop over the detections
	for i in range(0, detections.shape[2]):
		# extract the confidence (i.e., probability) associated with
		confidence = detections[0, 0, i, 2]

		# filter out weak detections by ensuring the confidence is
		# greater than the minimum confidence
		if confidence > threshold:
			# compute the (x, y)-coordinates of the bounding box for
			# the object
			box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
			(startX, startY, endX, endY) = box.astype("int")

			# ensure the bounding boxes fall within the dimensions of
			# the frame
			(startX, startY) = (max(0, startX), max(0, startY))
			(endX, endY) = (min(w - 1, endX), min(h - 1, endY))

			# check confidence value
			if (confidence < 0.9):
				break

			# extract the face ROI, convert it from BGR to RGB channel
			# ordering, resize it to 224x224, and preprocess it
			face = frame[startY:endY, startX:endX]
			
			face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
			face = cv2.resize(face, (224, 224))
			face = img_to_array(face)
			face = preprocess_input(face)
			face = np.expand_dims(face, axis=0)

			# add the face and bounding boxes to their respective
			# lists
			locs.append((startX, startY, endX, endY))
			#print(maskNet.predict(face)[0].tolist())
			preds.append(maskNet.predict(face)[0].tolist())
	return (locs, preds)


# SETTINGS
MASK_MODEL_PATH = os.getcwd()+"/FaceTracker/model/emotion_model.h5"
FACE_MODEL_PATH = os.getcwd()+"/FaceTracker/face_detector"
SOUND_PATH = os.getcwd()+"/sounds/alarm.wav"
THRESHOLD = 0.5

# Load Sounds
#mixer.init()
#sound = mixer.Sound(SOUND_PATH)

# load our serialized face detector model from disk
print("[INFO] loading face detector model...")
prototxtPath = os.path.sep.join([FACE_MODEL_PATH, "deploy.prototxt"])
weightsPath = os.path.sep.join(
	[FACE_MODEL_PATH, "res10_300x300_ssd_iter_140000.caffemodel"])
faceNet = cv2.dnn.readNet(prototxtPath, weightsPath)

# load the face mask detector model from disk
print("[INFO] loading emotion detector model...")
maskNet = load_model(MASK_MODEL_PATH)


# face detection
imagePath = path + '/FaceTracker/downloads/images'
images = []
classNames = []
myList = os.listdir(imagePath)
print(myList)

for cl in myList:
    curImg = cv2.imread(f'{imagePath}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])
print(classNames)

def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList 


# name for result
identificationName = 'undefined'

def markAttendance(name):
    print(name) 




#post report results 
def postReport():
	http = urllib3.PoolManager()
	r = http.request('GET', 'http://localhost:4000/api/pendingReports/one')

	y = json.loads(r.data)

	userId = y['user_id']
	tagId = y['tag_id']
	mediaId = y['media_id']
	lectureDate = y['lecture_date']
	tagName = y['tagName']

	userGet = http.request('GET', 'http://localhost:4000/api/users/' + userId)
	userData = json.loads(userGet.data)
	identification = userData['name'].upper() == identificationName
	
	attentive_count = 0
	careless_count = 0
	no_face_count = 0
	for x in results:
		if x['emotion'] == 'attentive':
			attentive_count+=1
		elif x['emotion'] == 'careless':
			careless_count+=1
		else :
			no_face_count+=1

	total = len(results)
	

	attentiveQuotient = attentive_count / total
	attentivePercentage = attentiveQuotient * 100

	carelessQuotient = careless_count / total
	carelessPercentage = carelessQuotient * 100

	noEmotionQuotient = no_face_count / total
	noEmotionPercentage = noEmotionQuotient * 100

	
	attentiveValue = '%.2f' %attentivePercentage
	carelessValue = '%.2f' %carelessPercentage
	noFaceValue = '%.2f' %noEmotionPercentage

	postData = {
	'identification': identification, 
	'tag_id': tagId, 
	'user_id': userId, 
	'media_id': mediaId, 
	'careless': carelessValue, 
	'attentive': attentiveValue,
	'no_face': noFaceValue,
	'lecture_date': lectureDate,
	'tagName': tagName,
	'results': results
	}
	

	postUrl = "http://localhost:4000/api/reports/"
	postHeaders = {'Content-type': 'application/json', 'Accept': 'text/plain'}
	postRequest = requests.post(postUrl, data=json.dumps(postData), headers=postHeaders)

	postdata = postRequest.text
	
	print(postdata)
	

        


encodeListKnown = findEncodings(images)
print('Encoding Complete')

# initialize the video stream and allow the camera sensor to warm up
print("[INFO] starting video stream...")

videoPath = path + '/FaceTracker/downloads/videos'
videoSrc = videoPath + '/' + mediaName
#vs = cv2.VideoCapture("downloads/videos/cut.mp4")
vs = cv2.VideoCapture(videoSrc)


fps = vs.get(cv2.CAP_PROP_FPS)
count = 0
frame_count = int(vs.get(cv2.CAP_PROP_FRAME_COUNT))
duration = frame_count/fps

timestamps = [vs.get(cv2.CAP_PROP_POS_MSEC)]
calc_timestamps = [0.0]
#vs.stream.set(cv2.CAP_PROP_FRAME_WIDTH, 324)
#vs.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, 264)
time.sleep(2.0)

labels = ["attentive", "careless", "cheater"]

prev_time = 0


# face match boolean
faceMatched = True


#Creating array for the result;
results = []
# loop over the frames from the video stream
while True:
	# grab the frame from the threaded video stream and resize it
	# to have a maximum width of 400 pixels
	ret, frame = vs.read()
	count += 1
	if frame is None:
		postReport()
		
		break

	frame = imutils.resize(frame, width=400)
	original_frame = frame.copy()
	frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)
	timestamps.append(vs.get(cv2.CAP_PROP_POS_MSEC))
	calc_timestamps.append(calc_timestamps[-1] + 1000/fps)
	# detect faces in the frame and determine if they are wearing a
	# face mask or not
	(locs, preds) = detect_and_predict_mask(frame, faceNet, maskNet, THRESHOLD)
     # Current time using datetime object
	# Current time using datetime object
	now = datetime.now()
	
	current_time = now.strftime("%H:%M:%S")
	# loop over the detected face locations and their corresponding
	# locations

	

	
	#face recognition
	if (faceMatched):
		success, img = vs.read()
		imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
		imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

		facesCurFrame = face_recognition.face_locations(imgS)
		encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)
		for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):

			matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
			faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

			#print(faceDis)
			matchIndex = np.argmin(faceDis)
			
			if matches[matchIndex]:
				name = classNames[matchIndex].upper()
				identificationName = name
				
				markAttendance(name)
				faceMatched = False
				break


	# No Face Detection
	if(locs == []):
		if (prev_time != int(count/fps)):
			prev_time = int(count/fps)
			results.append({'emotion': 'no_face', 'timestamp': int(count/fps)})


	for (box, pred) in zip(locs, preds):
		# unpack the bounding box and predictions
		(startX, startY, endX, endY) = box
		# include the probability in the label
		label = str(labels[np.argmax(pred)])
		# display the label and bounding box rectangle on the output
		# frame
		if label == "attentive":
			cv2.putText(original_frame, label, (startX, startY - 10),
			            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 200, 50), 2)
			cv2.rectangle(original_frame, (startX, startY),
			              (endX, endY), (0, 200, 50), 2)
			if (prev_time != int(count/fps)):
				prev_time = int(count/fps)
				print('attentive ' + 'time stamp current frame: ' + str(int(count/fps)))
				results.append({'emotion': 'attentive', 'timestamp': int(count/fps)})

		elif label == "careless":
			cv2.putText(original_frame, label, (startX, startY - 10),
			            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 2)
			cv2.rectangle(original_frame, (startX, startY),
			              (endX, endY), (255, 255, 255), 2)
			if (prev_time != int(count/fps)):
				prev_time = int(count/fps)
				print('careless ' + 'time stamp current frame: ' + str(int(count/fps)))
				results.append({'emotion': 'careless', 'timestamp': int(count/fps)})
		else :
			cv2.putText(original_frame, label, (startX, startY - 10),
			            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 50, 200), 2)
			cv2.rectangle(original_frame, (startX, startY),
			              (endX, endY), (0, 50, 200), 2)
		
	# show the output frame
	frame = cv2.resize(original_frame, (860, 490))
	cv2.imshow("Facial Expression", frame)
	key = cv2.waitKey(1) & 0xFF

    # if the `r` key was pressed, print result first index
	if key == ord("r"):
		ft = results[0].time.split(':')[1]
		first_time = int(ft)
		next_time = first_time + 5

		for x in results:
			print(x.emotion, x.time)
			#if(next_time = x.time):
			#print('true')
	# if the `q` key was pressed, break from the loop
	if key == ord("q"):
		break


# do a bit of cleanup
cv2.destroyAllWindows()

