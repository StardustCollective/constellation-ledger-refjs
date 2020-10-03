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

# get balance from ledger:

        npm start getlbalance

        response

        constellationjs
        address DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ
        balance 1000000000000

# send amount from mnemonic (put the whole mnemonic in quotes):

        npm start msend 1 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'

# send amount fromledger:

        npm start lsend 1 DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv
