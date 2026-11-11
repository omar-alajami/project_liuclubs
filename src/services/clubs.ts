// src/lib/clubs.ts
import { supabase } from '../auth/supabaseClient';
import type { Announcement, Club, ClubRequestInput, ProfileUpdateFields, ClubRequest } from '../assets/types.tsx';

export async function fetchClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*, club_categories ( category ), club_members ( count )')
    .order('name');

  if (error) throw error;

  const fixed: Club[] = (data ?? []).map((club: any) => {
    const { club_categories, club_members, ...rest } = club
    return {
      ...rest,
      categories: club_categories.map((c: { category: string }) => c.category),
      member_count: club_members[0]?.count ?? 0
    }
  });

  return fixed;
}

export async function fetchClubById(club_id: string): Promise<Club> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*, club_categories ( category ), club_members ( count )')
    .eq('club_id', club_id)
    .single()

  if (error) throw error;

  const { club_categories, club_members, ...rest } = data;
  return {
    ...rest,
    categories: club_categories.map((c:{category:string}) => c.category),
    member_count: club_members[0]?.count ?? 0
  }
}

export async function joinClub(club_id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from('club_members')
    .insert({ club_id, user_id })

  if (error) throw error;
}

export async function leaveClub(club_id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from('club_members')
    .delete()
    .eq('club_id', club_id)
    .eq('user_id', user_id)

  if (error) throw error;
}

export async function fetchClubAnnouncements(club_id: string, cursor?: string): Promise<Announcement[]> {
  const PAGE_SIZE = 5;

  let query = supabase
    .from('club_announcements')
    .select(`
      id,
      club_id,
      title,
      content,
      created_at,
      user:users_public (
        id,
        first_name,
        middle_name,
        last_name
      )
    `)
    .eq('club_id', club_id)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query.overrideTypes<Announcement[], { merge: false }>()
  if (error) throw error;
  return data;
}

export async function createAnnouncement(club_id:string, user_id: string, title: string, content?:string):Promise<void>{
  const { error } = await supabase.from('club_announcements').insert({
    club_id,
    user_id,
    title,
    content
  });

  if (error) throw error;
  return;
}

export async function deleteAnnouncement(ann_id:string):Promise<void>{
  const { error } = await supabase.from('club_announcements')
    .delete()
    .eq('id', ann_id)

  if (error) throw error;
  return;
}

export async function updateAnnouncement(ann_id: string, title: string, content?: string): Promise<void> {

  const updates: { title: string; content?: string } = { title };
  
  if (content !== undefined) {
    updates.content = content;
  }

  const { error } = await supabase
    .from('club_announcements')
    .update(updates)
    .eq('id', ann_id);

  if (error) throw error;

  return;
}

export async function fetchClubMembers(club_id: string):Promise<{ id: string; display_name: string; role: "member" | "moderator" | "president" }[]> {
  let query = supabase
    .from('club_members')
    .select(`
      role,
      user:users_public(
        id,
        first_name,
        middle_name,
        last_name
      )
    `)
    .eq('club_id', club_id);

  const { data, error } = await query.overrideTypes<{ role: 'member' | 'moderator' | 'president'; user: {"id": string, "first_name": string, "middle_name": string | null, "last_name": string} }[], { merge: false }>()

  if (error) throw error;

  return data.map(({ role, user }) => ({
    id: user.id,
    display_name: [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(' '),
    role,
  }));
}

export async function promoteMemberToModerator(club_id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from('club_members')
    .update({role: 'moderator'})
    .eq('club_id', club_id)
    .eq('user_id', user_id)
  if (error) throw error;

  return;
}

export async function demoteModeratorToMember(club_id: string, user_id: string): Promise<void>{
  const { error } = await supabase
    .from('club_members')
    .update({role: 'member'})
    .eq('club_id', club_id)
    .eq('user_id', user_id)
  if (error) throw error;

  return;
}

export async function removeUserFromClub(club_id: string, user_id: string): Promise<void>{
  const { error } = await supabase
    .from('club_members')
    .delete()
    .eq('club_id', club_id)
    .eq('user_id', user_id)
  if (error) throw error;

  return;
}

export async function submitClubRequest(request: ClubRequestInput): Promise<void>{
  const { error } = await supabase
    .from('create_requests')
    .insert(request)
  if (error) throw error;

  return;
}

export async function fetchJoinedClubs(clubIds: string[]): Promise<Club[]> {
  if (clubIds.length === 0) return [];

  const { data, error } = await supabase
    .from('clubs')
    .select('*, club_categories ( category ), club_members ( count )')
    .in('club_id', clubIds)
    .order('name');

  if (error) throw error;

  const joined: Club[] = (data ?? []).map((club: any) => {
    const { club_categories, club_members, ...rest } = club
    return {
      ...rest,
      categories: club_categories.map((c: { category: string }) => c.category),
      member_count: club_members[0]?.count ?? 0
    }
  });

  return joined;
}

export async function fetchLatestAnnouncements(clubIds: string[]): Promise<Announcement[]> {
  const LATEST_LIMIT = 2;

  if (clubIds.length === 0) return [];

  const { data, error } = await supabase
    .from('club_announcements')
    .select(`
      id,
      club_id,
      title,
      content,
      created_at,
      user:users_public (
        id,
        first_name,
        middle_name,
        last_name
      )
    `)
    .in('club_id', clubIds)
    .order('created_at', { ascending: false })
    .limit(LATEST_LIMIT)
    .overrideTypes<Announcement[], { merge: false }>()

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, fields: Partial<ProfileUpdateFields>):Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', userId);

  if (error) throw error;
  
  return;
}

// services/clubs.ts
export async function createClubWithPresident(fields: {
  clubId: string
  name: string
  shortDescription: string
  description: string
  school: string
  categories: string[]
  presidentEmail: string
}) {
  const { error } = await supabase.rpc('create_club_with_president', {
    p_club_id: fields.clubId,
    p_name: fields.name,
    p_short_description: fields.shortDescription,
    p_description: fields.description,
    p_school: fields.school,
    p_categories: fields.categories,
    p_president_email: fields.presidentEmail,
  })

  if (error) throw error;
}

export async function fetchClubCount():Promise<number | null>{
  const { count, error } = await supabase
    .from('clubs')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;

  return count;
}

export async function fetchFeaturedClubs(ids: string[]): Promise<Club[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('club_id, name, school, description, short_description, club_categories ( category ), club_members ( count )')
    .in('club_id', ids);
  if (error) throw error;

  const fixed: Club[] = (data ?? []).map((club: any) => {
    const { club_categories, club_members, ...rest } = club
    return {
      ...rest,
      categories: club_categories.map((c: { category: string }) => c.category),
      member_count: club_members[0]?.count ?? 0
    }
  });

  return fixed;
}

export async function fetchClubRequests(): Promise<ClubRequest[]> {
  const { data, error } = await supabase
    .from('create_requests')
    .select(`
      id,
      user_id,
      created_at,
      title,
      description,
      notes,
      phone_number,
      user:users ( first_name, middle_name, last_name, email )
    `)
    .order('created_at', { ascending: true })
    .overrideTypes<ClubRequest[], { merge: false }>()

  if (error) throw error;

  return data;
}