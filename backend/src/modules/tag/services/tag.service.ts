import { tagDAO } from '../dao/tag.dao';
import { TagResponseDTO } from '../domain/tag.dto';
import { logger } from '../../../shared/utils/logger';

const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export class TagService {
    async createTag(name: string): Promise<TagResponseDTO> {
        try {
            const trimmed = name.trim();
            const slug = slugify(trimmed);

            const existing = await tagDAO.findByName(trimmed);
            if (existing) return existing as TagResponseDTO;

            const tag = await tagDAO.create(trimmed, slug);
            return tag as TagResponseDTO;
        } catch (error) {
            logger.error('Error in createTag service:', error);
            throw new Error('Failed to create tag');
        }
    }

    async getAllTags(): Promise<TagResponseDTO[]> {
        try {
            const tags = await tagDAO.findAll();
            return tags as TagResponseDTO[];
        } catch (error) {
            logger.error('Error in getAllTags service:', error);
            throw new Error('Failed to retrieve tags');
        }
    }

    async getTagById(id: string): Promise<TagResponseDTO | null> {
        try {
            const tag = await tagDAO.findById(id);
            return tag as TagResponseDTO | null;
        } catch (error) {
            logger.error('Error in getTagById service:', error);
            throw new Error('Failed to retrieve tag');
        }
    }
}

export const tagService = new TagService();
