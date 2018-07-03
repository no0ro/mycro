import graphene

import backend.server.schemas.project
import backend.server.schemas.asc


class Query(backend.server.schemas.project.Query, backend.server.schemas.asc.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass


class Mutation(backend.server.schemas.project.Mutation, backend.server.schemas.asc.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)