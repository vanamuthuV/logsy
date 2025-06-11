package storage_service.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import storage_service.domain.Logs;

@Repository
public interface logsRepository extends MongoRepository<Logs, String>{

}
