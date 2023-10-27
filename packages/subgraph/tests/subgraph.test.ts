import { describe, test, newMockEvent, assert } from 'matchstick-as/assembly/index';
import { handleZKPRequestCreated } from '../src/targecy';
import { ZKPRequestCreated, ZKPRequestCreated__Params } from '../generated/Targecy/Targecy';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';

describe('Targecy', () => {
  // beforeAll(() => {
  //   let gravatar = new Gravatar("0x0")
  //   gravatar.displayName = “First Gravatar”
  //   gravatar.save()
  //   ...
  // })

  test('create zkprequests should save new entity', () => {
    const mockEvent = newMockEvent();
    const event = new ZKPRequestCreated(
      mockEvent.address,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      mockEvent.parameters,
      mockEvent.receipt
    );

    const randomId = 100;

    event.parameters = new Array();
    event.parameters.push(new ethereum.EventParam('zkRequestId', ethereum.Value.fromI32(randomId)));
    event.parameters.push(new ethereum.EventParam('metadataURI', ethereum.Value.fromString('metadataURI')));

    const address = Address.zero();
    event.parameters.push(new ethereum.EventParam('validator', ethereum.Value.fromAddress(address)));

    const query = new ethereum.Tuple();
    query.push(ethereum.Value.fromString('circuitId'));
    query.push(ethereum.Value.fromUnsignedBigInt(new BigInt(0)));
    query.push(ethereum.Value.fromArray([ethereum.Value.fromUnsignedBigInt(new BigInt(0))]));
    query.push(ethereum.Value.fromString('schema'));
    query.push(ethereum.Value.fromUnsignedBigInt(new BigInt(0)));

    event.parameters.push(new ethereum.EventParam('query', ethereum.Value.fromTuple(query)));

    assert.entityCount('ZKPRequest', 0);

    const a = new ZKPRequestCreated__Params(event);

    console.log(a.metadataURI);

    handleZKPRequestCreated(event);

    assert.entityCount('ZKPRequest', 1);

    assert.fieldEquals('ZKPRequest', randomId.toString(), 'id', randomId.toString());
  });
});
