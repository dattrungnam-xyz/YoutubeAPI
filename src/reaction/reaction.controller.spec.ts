import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { identity } from 'rxjs';
import { User } from '../users/entities/user.entity';
import { CreateReactionDTO } from './input/createReaction.dto';
import { ReactionType } from './entities/reaction.entity';

describe('ReactionController', () => {
  let controller: ReactionController;
  let service: ReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [ReactionService],
    })
      .overrideProvider(ReactionService)
      .useValue({
        reaction: jest.fn(),
      })
      .compile();

    controller = module.get<ReactionController>(ReactionController);
    service = module.get<ReactionService>(ReactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('reaction', () => {
    it('should create a reaction', async () => {
      let mockUser = { id: '1' } as User;
      let mockCreateReactionDTO: CreateReactionDTO = {
        type: ReactionType.LIKE,
        idComment: '1',
      } as CreateReactionDTO;
      let controllerSpy = jest.spyOn(controller, 'reaction');
      let serviceSpy = jest.spyOn(service, 'reaction');
      await controller.reaction(mockUser, mockCreateReactionDTO);
      expect(controllerSpy).toHaveBeenCalledWith(
        mockUser,
        mockCreateReactionDTO,
      );
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});
