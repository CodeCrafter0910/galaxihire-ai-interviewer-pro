# GalaxiHire - Testing Guide

## 🧪 Comprehensive Testing Checklist

### **Prerequisites**
- [ ] All services running (Frontend, Backend, Python)
- [ ] MongoDB connected
- [ ] OpenAI API key configured
- [ ] Test user account created

---

## **Test 1: Authentication Flow**

### Registration
- [ ] Navigate to `/register`
- [ ] Enter valid details (name, email, password)
- [ ] Test password validation (min 6 chars)
- [ ] Test password confirmation mismatch
- [ ] Verify auto-login after registration
- [ ] Check redirect to dashboard

### Login
- [ ] Navigate to `/login`
- [ ] Test with correct credentials
- [ ] Test with incorrect credentials
- [ ] Verify error messages
- [ ] Check token storage in localStorage
- [ ] Verify redirect to dashboard

### Logout
- [ ] Click logout from sidebar
- [ ] Verify redirect to login page
- [ ] Confirm token removed from localStorage
- [ ] Try accessing protected routes (should redirect to login)

**Expected Results:**
- ✅ Smooth registration and login
- ✅ Proper error handling
- ✅ Secure token management

---

## **Test 2: Resume Upload & Parsing**

### Upload Flow
- [ ] Navigate to `/resume-upload`
- [ ] Test drag-and-drop (if implemented)
- [ ] Upload PDF resume
- [ ] Upload DOCX resume
- [ ] Try uploading unsupported format (should fail gracefully)
- [ ] Try uploading file >5MB (should fail)

### Parsing Results
- [ ] Verify skills extracted (should show multiple)
- [ ] Check name extraction
- [ ] Check email extraction
- [ ] Check phone extraction
- [ ] Verify experience years
- [ ] Check education level
- [ ] View projects list
- [ ] View certifications

### Resume List
- [ ] View previously uploaded resumes
- [ ] Click "Use for Interview" button
- [ ] Verify skills pre-filled in interview

**Test Resumes:**
- Software engineer resume (tech heavy)
- General business resume
- Minimal information resume
- Multi-page PDF

**Expected Results:**
- ✅ All formats parse correctly
- ✅ Skills accurate (60+ keyword database)
- ✅ Contact info extracted
- ✅ Can reuse resume for interviews

---

## **Test 3: Interview Flow - Text Mode**

### Starting Interview
- [ ] Click "Start New Interview" from dashboard
- [ ] Verify auto-initialization
- [ ] Check first question appears
- [ ] Verify stage badge shows "HR"

### Answering Questions
- [ ] Type answer in text box
- [ ] Press Enter or click Send
- [ ] Verify AI evaluates answer
- [ ] Check feedback appears briefly
- [ ] Confirm next question loads
- [ ] Verify conversation history displays

### Stage Progression
- [ ] Answer 3-4 HR questions (behavioral)
- [ ] Watch for stage change to "Technical"
- [ ] Answer technical questions
- [ ] Watch for stage change to "Coding" (if applicable)

### Completion
- [ ] Answer enough questions for completion
- [ ] Or click "End Interview" button
- [ ] Verify completion screen shows scores
- [ ] Check auto-redirect to report page
- [ ] Verify interview appears in history

**Test Answers:**
- Very short answers (1 word)
- Detailed answers (paragraph)
- Off-topic answers
- Code snippets in answers

**Expected Results:**
- ✅ Smooth question/answer flow
- ✅ Real-time AI responses
- ✅ Stage progression works
- ✅ Proper completion handling

---

## **Test 4: Voice Interview**

### Microphone Setup
- [ ] Start interview
- [ ] Click "Start Voice Recording"
- [ ] Grant microphone permission
- [ ] Verify permission denied handling (deny once)

### Recording
- [ ] Start recording
- [ ] Verify red recording indicator
- [ ] Speak answer clearly (15-30 seconds)
- [ ] Click "Stop Recording"
- [ ] Check audio playback works

### Voice Analysis
- [ ] After recording, view analysis metrics:
  - [ ] Confidence score (0-100)
  - [ ] Tone classification
  - [ ] Speech rate (WPM)
  - [ ] Emotional state
- [ ] Verify metrics are reasonable

### Transcription
- [ ] Click "Send & Transcribe"
- [ ] Wait for processing
- [ ] Verify transcribed text appears
- [ ] Check accuracy of transcription
- [ ] Confirm answer sent to interview

**Test Scenarios:**
- Quiet speaking
- Loud speaking
- Fast speaking
- Slow speaking
- Background noise

**Expected Results:**
- ✅ Audio captures correctly
- ✅ Transcription accurate
- ✅ Voice metrics displayed
- ✅ Analysis scores reasonable

---

## **Test 5: Video Interview**

### Camera Setup
- [ ] Click video recording option
- [ ] Grant camera + mic permission
- [ ] Verify camera preview (mirror mode)
- [ ] Test permission denied handling

### Recording Flow
- [ ] Click "Start Video Recording"
- [ ] See 3-2-1 countdown
- [ ] Record 15-30 second answer
- [ ] Verify recording indicator
- [ ] Click "Stop Recording"

### Review & Submit
- [ ] Watch playback of recording
- [ ] Use "Re-record" if needed
- [ ] Click "Submit Video"
- [ ] Verify upload success
- [ ] Check video saved in session

**Test Browsers:**
- Chrome/Edge
- Firefox
- Safari (Mac)
- Mobile browser

**Expected Results:**
- ✅ Camera access works
- ✅ Recording smooth (no lag)
- ✅ Playback works
- ✅ Upload successful

---

## **Test 6: Code Editor**

### Editor Setup
- [ ] Reach technical/coding stage
- [ ] Verify Monaco editor loads
- [ ] Check syntax highlighting
- [ ] Test language selector

### Code Execution
- [ ] Select Python
- [ ] Write simple code (print "Hello")
- [ ] Click "Run Code"
- [ ] Verify output displays
- [ ] Test code with errors
- [ ] Check error messages

### Language Testing
- [ ] Test Python code execution
- [ ] Test JavaScript code execution
- [ ] Test Java code execution
- [ ] Verify different syntax highlighting

### Submit Solution
- [ ] Write solution code
- [ ] Click "Submit Solution"
- [ ] Verify answer sent to interview
- [ ] Check next question appears

**Test Code:**
```python
# Python
def solution():
    return sum([1, 2, 3, 4, 5])
print(solution())
```

```javascript
// JavaScript
function solution() {
    return [1, 2, 3, 4, 5].reduce((a, b) => a + b);
}
console.log(solution());
```

**Expected Results:**
- ✅ Editor responsive
- ✅ Code runs correctly
- ✅ Output displays
- ✅ All languages work

---

## **Test 7: Report Generation**

### Auto-Generation
- [ ] Complete interview
- [ ] Verify auto-redirect to report
- [ ] Check report generation loading
- [ ] Wait for report to load

### Report Content
- [ ] Verify all scores displayed:
  - [ ] Overall score
  - [ ] Communication score
  - [ ] Technical score
  - [ ] Confidence score
  - [ ] Coding score
- [ ] Check strengths list (not empty)
- [ ] Check improvements list (not empty)
- [ ] Verify recommendations present
- [ ] View learning roadmap (4 weeks)

### PDF Download
- [ ] Click "Download PDF"
- [ ] Verify file downloads
- [ ] Open PDF and check formatting
- [ ] Verify all content present in PDF

### Report List
- [ ] Navigate to `/report`
- [ ] View all reports
- [ ] Click on specific report
- [ ] Verify detail view loads
- [ ] Return to list view

**Expected Results:**
- ✅ Reports generate quickly (<10 seconds)
- ✅ Scores accurate and reasonable
- ✅ Feedback helpful and specific
- ✅ PDF formatted correctly

---

## **Test 8: Dashboard & Analytics**

### Statistics
- [ ] Navigate to dashboard
- [ ] Check total interviews count
- [ ] Verify completed interviews count
- [ ] Check average score calculation
- [ ] Verify completion rate percentage

### Recent Interviews
- [ ] View interview history on dashboard
- [ ] Check status badges (completed/in-progress)
- [ ] Verify scores display for completed
- [ ] Click interview to view details

### Quick Actions
- [ ] Test "Start New Interview" button
- [ ] Test "View Reports" button
- [ ] Test "Upload Resume" button

**Expected Results:**
- ✅ Stats accurate
- ✅ History updated in real-time
- ✅ Navigation works

---

## **Test 9: Edge Cases & Error Handling**

### Network Issues
- [ ] Start interview
- [ ] Disconnect internet mid-answer
- [ ] Check error message
- [ ] Reconnect and retry

### Token Expiration
- [ ] Manually delete token from localStorage
- [ ] Try accessing protected route
- [ ] Verify redirect to login

### Long Sessions
- [ ] Start interview
- [ ] Leave idle for 10+ minutes
- [ ] Try submitting answer
- [ ] Check session still active

### Concurrent Sessions
- [ ] Open two browser tabs
- [ ] Start interviews in both
- [ ] Verify separate sessions

**Expected Results:**
- ✅ Graceful error handling
- ✅ Clear error messages
- ✅ No crashes or blank screens

---

## **Test 10: Mobile Responsiveness**

### Test Devices
- [ ] iPhone (iOS Safari)
- [ ] Android phone (Chrome)
- [ ] iPad/Tablet
- [ ] Small screen laptop

### Key Pages
- [ ] Login page mobile layout
- [ ] Dashboard mobile view
- [ ] Interview page on mobile
- [ ] Report page mobile layout

### Touch Interactions
- [ ] Tap buttons (large enough?)
- [ ] Scroll smoothly
- [ ] Text input works
- [ ] Modals/popups display correctly

**Expected Results:**
- ✅ All pages responsive
- ✅ Touch-friendly UI
- ✅ No horizontal scroll
- ✅ Readable text sizes

---

## **Test 11: Cross-Browser Testing**

Test on:
- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Microsoft Edge (latest)
- [ ] Safari (Mac)
- [ ] Mobile browsers

Focus on:
- WebRTC features (video/audio)
- Monaco Editor
- File uploads
- Local storage

---

## **Test 12: Performance Testing**

### Load Times
- [ ] Measure homepage load time (<3s)
- [ ] Measure interview page load (<2s)
- [ ] Check dashboard load time
- [ ] Test with slow 3G throttling

### Large Data
- [ ] Upload large resume (near 5MB)
- [ ] Record long audio (2+ minutes)
- [ ] Record longer video
- [ ] Complete 20+ question interview

---

## **Bug Report Template**

When you find issues, document:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome 120, etc.]
**Screenshots**: [If applicable]
**Console Errors**: [Check browser console]
```

---

## **Testing Completion Checklist**

- [ ] All 12 test sections completed
- [ ] Bugs documented
- [ ] Critical bugs fixed
- [ ] Nice-to-have bugs noted for future
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Cross-browser compatible
- [ ] Ready for deployment ✅
