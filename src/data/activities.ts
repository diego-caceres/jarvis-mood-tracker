import { Activity } from "@/types/activity";

export const predefinedActivities: Activity[] = [
  // Hobbies
  {
    id: "surf",
    name: "Surf",
    category: "Hobbies",
    icon: "🏄",
    points: 5,
    description: "Going surfing",
  },
  {
    id: "surfskate",
    name: "SurfSkate",
    category: "Hobbies",
    icon: "🛹",
    points: 4,
    description: "SurfSkate session",
  },
  {
    id: "reading-fiction",
    name: "Reading Fiction",
    icon: "📚",
    category: "Hobbies",
    points: 3,
    description: "Reading fiction books",
  },

  // Sports & Exercise
  {
    id: "natural-gymnastics",
    name: "Natural Gymnastics",
    category: "Exercise",
    icon: "🤸",
    points: 5,
    description: "Natural gymnastics training",
  },
  {
    id: "cycling",
    name: "Cycling",
    category: "Exercise",
    icon: "🚴",
    points: 4,
    description: "Going for a bike ride",
  },
  {
    id: "swimming",
    name: "Swimming",
    category: "Exercise",
    icon: "🏊",
    points: 4,
    description: "Swimming session",
  },
  {
    id: "walking",
    name: "Walking",
    category: "Exercise",
    icon: "🚶",
    points: 3,
    description: "Going for a walk",
  },

  // Obligations & Responsibilities
  {
    id: "work",
    name: "Work",
    category: "Work",
    icon: "💼",
    points: 2,
    description: "Working on professional tasks",
  },
  {
    id: "family-tasks",
    name: "Family Tasks",
    category: "Obligations",
    icon: "👨‍👩‍👧‍",
    points: 2,
    description: "Taking care of family-related responsibilities",
  },
  {
    id: "home-maintenance",
    name: "Home Maintenance",
    category: "Obligations",
    icon: "🏡",
    points: 2,
    description: "Taking care of home maintenance tasks",
  },

  // Personal Growth
  {
    id: "reading-non-fiction",
    name: "Reading Non-Fiction",
    category: "Personal Growth",
    icon: "📖",
    points: 4,
    description: "Reading educational or self-improvement materials",
  },
  {
    id: "learning",
    name: "Learning Something New",
    category: "Personal Growth",
    icon: "🧠",
    points: 5,
    description: "Learning a new skill or concept",
  },
  {
    id: "personal-projects",
    name: "Personal Projects",
    category: "Personal Growth",
    icon: "🛠️",
    points: 4,
    description: "Working on personal development projects",
  },

  // Other Activities
  {
    id: "travel-planning",
    name: "Travel Planning",
    category: "Other",
    icon: "✈️",
    points: 3,
    description: "Planning trips or travel activities",
  },
  {
    id: "outdoors",
    name: "Spending Time Outdoors",
    category: "Other",
    icon: "🌲",
    points: 4,
    description: "Spending time in nature",
  },
  {
    id: "exploring",
    name: "Exploring New Places",
    category: "Other",
    icon: "🗺️",
    points: 4,
    description: "Exploring new restaurants, cafes, or cultural spots",
  },
  // Negative Activities
  {
    id: "fast-food",
    name: "Fast Food",
    category: "Food",
    icon: "🍔",
    points: -3,
    description: "Eating fast food",
  },
  {
    id: "skip-workout",
    name: "Skip Workout",
    category: "Exercise",
    icon: "🚫",
    points: -2,
    description: "Skipping planned workout",
  },
  {
    id: "procrastination",
    name: "Procrastination",
    category: "Work",
    icon: "⏳",
    points: -3,
    description: "Unproductive time or procrastination",
  },
];
