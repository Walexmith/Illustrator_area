function calculateArea(path) {
    if (!path.closed) return 0;

    var points = path.pathPoints;
    var area = 0;
    var n = points.length;

    for (var i = 0; i < n; i++) {
        var p1 = points[i].anchor;
        var p2 = points[(i + 1) % n].anchor;
        area += (p1[0] * p2[1] - p2[0] * p1[1]);
    }

    return area / 2; // signe important
}

function convertPt2ToMm2(pt2) {
    var ptToMM = 0.352778;
    return pt2 * Math.pow(ptToMM, 2);
}

function getTopRightPosition(item) {
    var bounds = item.geometricBounds; // [y1, x1, y2, x2]
    return [bounds[2], bounds[1]];
}

function getOrCreateSurfacesLayer(doc) {
    var layer;
    try {
        layer = doc.layers.getByName("Surfaces");
    } catch (e) {
        layer = doc.layers.add();
        layer.name = "Surfaces";
    }
    layer.visible = true;
    layer.locked = false;
    return layer;
}

function annotateArea(item, mm2, m2, layer) {
    var pos = getTopRightPosition(item);
    var tf = layer.textFrames.add();
    tf.contents = mm2.toFixed(2) + " mm²\n" + m2.toFixed(4) + " m²";
    tf.left = pos[0] + 5;
    tf.top = pos[1] - 5;
    tf.textRange.characterAttributes.size = 8;
}

function areaOfCompoundPath(compoundPath) {
    var total = 0;
    for (var i = 0; i < compoundPath.pathItems.length; i++) {
        var subPath = compoundPath.pathItems[i];
        if (subPath.closed) {
            total += calculateArea(subPath); // les trous auront une aire négative
        }
    }
    return Math.abs(total); // on garde la vraie aire visible
}

function main() {
    if (app.documents.length === 0) {
        alert("Aucun document ouvert."); return;
    }

    var sel = app.activeDocument.selection;
    if (sel.length === 0) {
        alert("Aucun objet sélectionné."); return;
    }

    var scaleInput = prompt("Échelle du plan (1:x) — entrez x :", "1");
    if (scaleInput === null) return;
    var scale = parseFloat(scaleInput);
    if (isNaN(scale) || scale <= 0) {
        alert("Échelle invalide."); return;
    }

    var correction = Math.pow(scale, 2);
    var totalArea = 0;
    var skippedItems = [];

    var doc = app.activeDocument;
    var surfacesLayer = getOrCreateSurfacesLayer(doc);

    for (var i = 0; i < sel.length; i++) {
        var item = sel[i];
        var areaPt = 0;

        if (item.typename === "PathItem") {
            if (typeof item.opacity === "number" && item.opacity === 0) {
                skippedItems.push("Objet ignoré (opacité 0)");
                continue;
            }
            if (!item.closed) {
                skippedItems.push("Tracé non fermé ignoré.");
                continue;
            }
            areaPt = Math.abs(calculateArea(item));
        }

        else if (item.typename === "CompoundPathItem") {
            if (typeof item.opacity === "number" && item.opacity === 0) {
                skippedItems.push("Tracé composé ignoré (opacité 0)");
                continue;
            }
            areaPt = areaOfCompoundPath(item);
        }

        else {
            skippedItems.push("Type non pris en charge : " + item.typename);
            continue;
        }

        var mm2 = convertPt2ToMm2(areaPt) * correction;
        var m2 = mm2 / 1000000;
        annotateArea(item, mm2, m2, surfacesLayer);
        totalArea += mm2;
    }

    if (totalArea > 0) {
        alert(
            "Échelle 1:" + scale + "\n" +
            "Aire totale :\n" +
            totalArea.toFixed(2) + " mm²\n" +
            (totalArea / 1000000).toFixed(4) + " m²"
        );
    } else {
        alert("Aucune aire calculable trouvée.");
    }

    if (skippedItems.length > 0) {
        alert("Objets ignorés :\n" + skippedItems.join("\n"));
    }
}

main();
