export type Club = {
  club_id: string
  name: string
  school: string
  description: string
  short_description: string
  categories: string[]
  member_count: number
}

export type Announcement = {
  id: string
  club_id: string
  title: string
  content: string
  created_at: string
  user: {id: string, first_name: string, middle_name: string | null, last_name: string} | null
}

export type ClubRequestInput = {
  user_id: string
  title: string
  description: string
  notes?: string
  phone_number: string
}

export type ProfileUpdateFields = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone_number: string | null;
  major: string | null;
};

export type ClubRequest = {
  id: string
  user_id: string
  created_at: string
  title: string
  description: string
  notes: string | null
  phone_number: string
  user: {
    first_name: string
    middle_name: string | null
    last_name: string
    email: string
  } | null
}
