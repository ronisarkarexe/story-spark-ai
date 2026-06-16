ALTER TABLE stories ADD COLUMN parent_story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE;
ALTER TABLE stories ADD COLUMN branch_name TEXT;
CREATE INDEX idx_stories_parent ON stories(parent_story_id);
