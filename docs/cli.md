# get balance from mnemonic (put the whole mnemonic in quotes):

        npm start getmbalance 'frost dismiss trophy borrow bunker barrel actress cook annual property control bundle'

        response

        address DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv
        balance undefined



        npm start getmbalance 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'

        response

        constellationjs
        address DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ
        balance 1000000000000

# get device info from ledger:

        npm start linfo

        response

        constellationjs
        info {
          enabled: true,
          error: false,
          message: 'Ledger Device Found.',
          deviceInfo: { manufacturer: 'Ledger', product: 'Nano S', serialNumber: '0001' }
        }


# get balance from ledger:

        npm start getlbalance

        response

        constellationjs
        address DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ
        balance 1000000000000

# send amount from mnemonic (put the whole mnemonic in quotes):

        npm start msend 10 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'

        npm start msend 10 DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ 'frost dismiss trophy borrow bunker barrel actress cook annual property control bundle'

# send amount fromledger:

        # 1 raw
        npm start lsend 1 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv

        # 10 raw
        npm start lsend 10 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv

        # 1 dag, 100,000,000 raw
        npm start lsend 100000000 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv

        # 10 dag, 1,000,000,000 raw
        npm start lsend 1000000000 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv
