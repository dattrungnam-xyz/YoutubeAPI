import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { updateProfileDTO } from './input/updateProfile.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let mockUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();
    mockUser = { id: '1' } as User;

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });
  describe('updateProfile', () => {
    let mockUpdateProfileDTO: updateProfileDTO;
    beforeAll(() => {
      mockUpdateProfileDTO = { name: 'name', avatar: 'url' };
    });
    it('should update profile', async () => {
      jest.spyOn(service, 'updateProfile').mockResolvedValue(undefined);
      await service.updateProfile(mockUser, mockUpdateProfileDTO);
      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUser,
        mockUpdateProfileDTO,
      );
    });
  });
  describe('subcribe', () => {
    let mockId: string;
    let mockNewUser: User;
    let mockUser: User;
    beforeAll(() => {
      mockId = '2';
      mockNewUser = { id: '2' } as User;
    });
    it('should throw NotFoundException if user does not exist', async () => {
      mockUser = {
        id: '1',
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.subcribe(mockUser, mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should add newUser to currUser.subscribes if not already subscribed', async () => {
      mockUser = {
        id: '1',
        subcribes: Promise.resolve([]),
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockNewUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      const result = await service.subcribe(mockUser, mockId);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(await mockUser.subcribes).toContain(mockNewUser);
      expect(result).toBe(mockUser);
    });
    it('should not add newUser to currUser.subscribes if already subscribed', async () => {
      mockUser = {
        id: '1',
        subcribes: Promise.resolve([mockNewUser]),
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockNewUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      const result = await service.subcribe(mockUser, mockId);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(await mockUser.subcribes).toHaveLength(1);
      expect(result).toBe(mockUser);
    });
  });
  describe('unsubcribe', () => {
    let mockId: string;
    let mockNewUser: User;
    let mockUser: User;
    beforeAll(() => {
      mockId = '2';
      mockNewUser = { id: '2' } as User;
    });
    it('should throw NotFoundException if user does not exist', async () => {
      mockUser = {
        id: '1',
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.unsubcribe(mockUser, mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should remove newUser to currUser.subscribes if already subscribed', async () => {
      mockUser = {
        id: '1',
        subcribes: Promise.resolve([mockNewUser]),
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockNewUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      const result = await service.unsubcribe(mockUser, mockId);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(await mockUser.subcribes).not.toContain(mockNewUser);
      expect(result).toBe(mockUser);
    });
    it('should not remove newUser to currUser.subscribes if not subscribed', async () => {
      mockUser = {
        id: '1',
        subcribes: Promise.resolve([]),
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockNewUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      const result = await service.unsubcribe(mockUser, mockId);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
      expect(userRepository.findOne).toHaveBeenCalled();

      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(await mockUser.subcribes).toHaveLength(0);
      expect(result).toBe(mockUser);
    });
  });
});
