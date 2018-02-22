<?php
/**
 * This file is part of Oyst_OneClick for Magento.
 *
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @author Oyst <plugin@oyst.com> <@oyst>
 * @category Oyst
 * @package Oyst_OneClick
 * @copyright Copyright (c) 2017 Oyst (http://www.oyst.com)
 */

/**
 * ZipMap class
 */
class Oyst_OneClick_Helper_ZipMap
{
    private static $zipMap = array(
        '75001' => 'PARIS 01',
        '75002' => 'PARIS 02',
        '75003' => 'PARIS 03',
        '75004' => 'PARIS 04',
        '75005' => 'PARIS 05',
        '75006' => 'PARIS 06',
        '75007' => 'PARIS 07',
        '75008' => 'PARIS 08',
        '75009' => 'PARIS 09',
        '75010' => 'PARIS 10',
        '75011' => 'PARIS 11',
        '75012' => 'PARIS 12',
        '75013' => 'PARIS 13',
        '75014' => 'PARIS 14',
        '75015' => 'PARIS 15',
        '75016' => 'PARIS 16',
        '75017' => 'PARIS 17',
        '75018' => 'PARIS 18',
        '75019' => 'PARIS 19',
        '75020' => 'PARIS 20',
        '69001' => 'Lyon 01',
        '69002' => 'Lyon 02',
        '69003' => 'Lyon 03',
        '69004' => 'Lyon 04',
        '69005' => 'Lyon 05',
        '69006' => 'Lyon 06',
        '69007' => 'Lyon 07',
        '69008' => 'Lyon 08',
        '69009' => 'Lyon 09',
        '13001' => 'Marseille 01',
        '13002' => 'Marseille 02',
        '13003' => 'Marseille 03',
        '13004' => 'Marseille 04',
        '13005' => 'Marseille 05',
        '13006' => 'Marseille 06',
        '13007' => 'Marseille 07',
        '13008' => 'Marseille 08',
        '13009' => 'Marseille 09',
        '13010' => 'Marseille 10',
        '13011' => 'Marseille 11',
        '13012' => 'Marseille 12',
        '13013' => 'Marseille 13',
        '13014' => 'Marseille 14',
        '13015' => 'Marseille 15',
        '13016' => 'Marseille 16',
    );

    public static function getZipMap()
    {
        return self::$zipMap;
    }
}
