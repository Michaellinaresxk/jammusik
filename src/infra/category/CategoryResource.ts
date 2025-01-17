import type CategoryRepository from '../../domain/category/CategoryRepository';
import {CategoryCaller} from './CategoryCaller';
import Category from '../../domain/category/Category';
import Song from '../../domain/song/Song';
export class CategoryResource implements CategoryRepository {
  constructor(public readonly categoryCaller: CategoryCaller) {}

  async createCategory(title: string, userId: string,): Promise<Category> {
    const apiCategory = await this.categoryCaller.createCategory(title, userId);
    return new Category(
      apiCategory.id,
      apiCategory.title,
      userId
    );
  }

  async getCategories(userId: string): Promise<Category[]> {
    const apiCategories = await this.categoryCaller.getCategories(userId);
    return apiCategories.map(
      category => new Category(
        category.id,
        category.title,
        category.userId
      ),
    );
  }

  async getSongListByCategory(
    userId: string,
    categoryId: string,
  ): Promise<Song[]> {
    const apiSongs = await this.categoryCaller.getSongListByCategory(
      userId,
      categoryId,
    );
    return apiSongs.map(
      song =>
        new Song(
          song.id,
          song.categoryId,
          song.title,
          song.artist,
          song.isDone,
          song.playlistId,
        ),
    );
  }

  async getAllSongsByUserId(userId: string): Promise<Song[]> {
    const apiSongs = await this.categoryCaller.getAllSongsByUserId(userId);
    return apiSongs.map(
      song =>
        new Song(
          song.id,
          song.categoryId,
          song.title,
          song.artist,
          song.isDone,
          song.playlistId,
        ),
    );
  }

  async updateCategory(categoryId: string, title: string, userId: string): Promise<Category> {
    await this.categoryCaller.updateCategory(categoryId, title);
    return new Category(categoryId, title, userId);
  }

  async deleteCategory(userId: string, categoryId: string) {
    return await this.categoryCaller.deleteCategory(userId, categoryId);
  }
}
