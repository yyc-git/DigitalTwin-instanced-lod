import { loadFeature, defineFeature } from "jest-cucumber"
import { Object3D, Mesh } from "three"
import { range } from "../../src/utils/ArrayUtils"
import { invertStructure } from "../../src/instance/Instance"
import { InstanceSourceLOD } from "../../src/lod/InstanceSourceLOD"

const feature = loadFeature("./test/features/instance.feature")

defineFeature(feature, test => {
    test("invert structure", ({
        given,
        when,
        then
    }) => {
        let meshes, mesh, child1, child2, child1_1
        let clonedMesh
        // , clonedChild1, clonedChild2, clonedChild1_1
        let result

        let _buildMesh = () => {
            mesh = new InstanceSourceLOD()

            child1 = new InstanceSourceLOD()
            child2 = new InstanceSourceLOD()


            child1_1 = new InstanceSourceLOD()

            mesh.add(child1, child2)

            child1.add(child1_1)
        }

        given("build lod meshes", () => {
            _buildMesh()

            meshes = []

            range(0, 2).forEach(i => {
                clonedMesh = mesh.clone(true)

                // clonedChild1 = child1.clone()
                // clonedChild1_1 = child1_1.clone()

                // clonedChild1.add(clonedChild1_1)

                // clonedChild2 = child2.clone()

                // clonedMesh.add(clonedChild1, clonedChild2)

                // console.log(clonedMesh.children.length)
                meshes.push(clonedMesh)
            })
        })

        when("invert them", () => {
            result = invertStructure(meshes)
        })

        then("return inverted structure", () => {
            // {
            //                 clonedOnes: meshes,
            //                 children: [
            //                     {
            //                         clonedOnes: [child1_0, ...  ],
            //                         children: [
            //                             {
            //                                 clonedOnes: [child1_1_0, ...  ],
            //                                 children: []
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         clonedOnes: [child2_0, ...  ],
            //                         children: []
            //                     }
            //                 ]
            //             }

            // console.log(result.children)

            expect(result.clonedOnes).toEqual(meshes)
            expect(result.children.length).toEqual(2)
            expect(result.children[0].clonedOnes.length).toEqual(3)

            expect(result.children[0].children.length).toEqual(1)
            expect(result.children[0].children[0].clonedOnes.length).toEqual(3)
            expect(result.children[1].clonedOnes.length).toEqual(3)
            expect(result.children[1].children.length).toEqual(0)
        })
    })
})