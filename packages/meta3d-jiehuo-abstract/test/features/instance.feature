Feature: Instance
    As a Instance
    I want to convert meshes to instanced meshes
    So that I can batch draw

    Scenario: invert structure
        Given build lod meshes
        When invert them
        Then return inverted structure
