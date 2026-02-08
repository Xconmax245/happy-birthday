# 💕 Forever Yours - Digital Love Experience

A romantic, soft-pastel, playful yet elegant multi-page website designed as a digital love experience for your special someone.

## ✨ Features

- **Emotional & Poetic Design** - Soft pastels, glassmorphism, and subtle animations
- **6 Beautiful Pages** - Landing, Love Story, Questions, Memories, Surprise, Message
- **Interactive Elements** - Flip cards, expandable timeline, lightbox gallery
- **Smooth Transitions** - Custom JS page swapping with fade effects
- **State Persistence** - Answers and preferences saved in sessionStorage
- **Fully Responsive** - Mobile-first design that works on all devices
- **Floating Hearts** - Gentle background animation throughout

## 📁 Project Structure

```
/
├── index.html          # Landing page with Lottie animation
├── love-story.html     # Timeline of your love story
├── questions.html      # Interactive flip card questions
├── memories.html       # Photo/video gallery with lightbox
├── surprise.html       # Confetti surprise reveal
├── message.html        # Love letter with scroll reveal
│
├── css/
│   └── globals.css     # Complete design system
│
├── js/
│   ├── router.js       # Page transitions
│   ├── state.js        # sessionStorage management
│   ├── animations.js   # AOS, floating hearts, effects
│   ├── questions.js    # Question card logic
│   ├── memories.js     # Gallery & lightbox
│   └── surprise.js     # Confetti animation
│
├── assets/
│   ├── images/         # Your photos (add your own!)
│   ├── videos/         # Your videos (add your own!)
│   └── lottie/         # Lottie JSON files
│
└── netlify.toml        # Netlify deployment config
```

## 🎨 Customization Guide

### Adding Your Photos

1. Add your images to `assets/images/`
2. Edit `memories.html` and replace the Unsplash URLs with your images
3. Update the captions to match your memories

### Editing the Love Story

1. Open `love-story.html`
2. Find each timeline event and edit the titles and descriptions
3. Add or remove events as needed

### Changing the Message

1. Open `message.html`
2. Edit each paragraph in the letter container
3. Make it personal!

### Adding Questions

1. Open `js/questions.js`
2. Find the `QUESTION_BANK` array
3. Add or modify questions

## 🚀 Deployment to Netlify

### Option 1: Drag & Drop

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder
3. Done! Your site is live

### Option 2: Git Deployment

1. Push to GitHub/GitLab/Bitbucket
2. Connect your repo to Netlify
3. Auto-deploys on every push

## 💡 Technologies Used

- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom properties, glassmorphism, animations
- **Vanilla JavaScript** - No frameworks, just clean JS
- **AOS** - Animate On Scroll library
- **Lottie** - Beautiful vector animations
- **Lucide Icons** - Beautiful open-source icons

## 🎁 Creating the Perfect Experience

1. **Photos**: Add 6-12 of your favorite photos together
2. **Timeline**: Customize the love story events with your real dates
3. **Questions**: Keep or change the questions to be more personal
4. **Message**: Write your own heartfelt letter
5. **Test**: Preview locally before sharing

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 💕 Made with Love

This website was crafted to celebrate love in its purest form.
May it bring joy to you and your special someone.

---

_"In a world of fleeting moments, you are my forever."_
